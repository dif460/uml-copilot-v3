# -*- coding: utf-8 -*-
import win32com.client, pythoncom, array, os

pythoncom.CoInitializeEx(pythoncom.COINIT_MULTITHREADED)
app = win32com.client.Dispatch("Visio.Application")
doc = app.Documents.Add("BASFLO_M.VSTX")
page = app.ActivePage

PW, PH = 8.5, 14.0
page.PageSheet.CellsU("PageWidth").Formula = f"{PW} in"
page.PageSheet.CellsU("PageHeight").Formula = f"{PH} in"

FONT_SIZE = 9
shapes = {}


def add_shape(key, text, cx, tm, w=2.5, h=0.5):
    left = cx - w / 2
    vt = PH - tm
    vb = vt - h
    rect = page.DrawRectangle(left, vt, left + w, vb)
    rect.Text = text
    try: rect.CellsU("ParaProps.HorzAlign").FormulaForce = "0"
    except: pass
    try: rect.CellsU("Char.Size").FormulaForce = str(FONT_SIZE)
    except: pass
    shapes[key] = {"cx": cx, "vt": vt, "vb": vb, "h": h, "w": w}
    return rect


def arrow(fk, tk):
    s, d = shapes[fk], shapes[tk]
    ln = page.DrawLine(s["cx"], s["vb"], d["cx"], d["vt"])
    try: ln.CellsU("EndArrow").FormulaForce = "11"
    except: pass
    return ln


# === TITLE ===
add_shape("title", "饵料间工作流程图", 4.25, 0.3, 3.5, 0.6)

# === MAIN FLOW ===
add_shape("n1", "出鱼（每日午四点）", 4.25, 1.2, 2.5, 0.5)
add_shape("n2", "放冰箱保存", 4.25, 2.0, 2.5, 0.5)
add_shape("n3", "夜班人员解冻", 4.25, 2.8, 2.5, 0.5)
arrow("n1", "n2")
arrow("n2", "n3")

# === LEFT BRANCH ===
LCX = 1.8
add_shape("n3_1", "凌晨十二点，解冻上午所需（放操作台上方）", LCX, 3.8, 3.2, 0.5)
add_shape("n4l", "上午九点：按等级分表", LCX, 4.6, 3.2, 0.5)
add_shape("n5l", "制作饵料：去头、去内脏、切块、装桶、清洗", LCX, 5.4, 3.2, 0.5)
add_shape("n6l", "未用完的框加水块下一餐使用", LCX, 6.2, 3.2, 0.5)
add_shape("n7l", "清理饵料间", LCX, 7.0, 3.2, 0.5)

# === RIGHT BRANCH ===
RCX = 6.5
add_shape("n3_2", "凌晨四点解冻下午所需（放操作台下方）", RCX, 3.8, 3.2, 0.5)
add_shape("n4r", "将次日用鱼分开放冰箱", RCX, 4.6, 3.2, 0.5)
add_shape("n5r", "下午三点：按等级分表", RCX, 5.4, 3.2, 0.5)
add_shape("n6r", "按等级分表", RCX, 6.2, 3.2, 0.5)
add_shape("n7r", "制作饵料", RCX, 7.0, 3.2, 0.5)
add_shape("n8r", "彻底打扫饵料间", RCX, 7.8, 3.2, 0.5)
add_shape("n9r", "废弃饵料移交夜班人员联系废料回收人员回收", RCX, 8.6, 3.8, 0.5)
add_shape("n10r", "刷洗饵料桶", RCX, 9.4, 3.2, 0.5)

# === SPLIT: n3 to branches ===
s3 = shapes["n3"]
d31 = shapes["n3_1"]
d32 = shapes["n3_2"]
lnl = page.DrawLine(s3["cx"], s3["vb"], d31["cx"], d31["vt"])
lnr = page.DrawLine(s3["cx"], s3["vb"], d32["cx"], d32["vt"])
try: lnl.CellsU("EndArrow").FormulaForce = "11"
except: pass
try: lnr.CellsU("EndArrow").FormulaForce = "11"
except: pass

# === LEFT ARROWS ===
arrow("n3_1", "n4l")
arrow("n4l", "n5l")
arrow("n5l", "n6l")
arrow("n6l", "n7l")

# === RIGHT ARROWS ===
arrow("n3_2", "n4r")
arrow("n4r", "n5r")
arrow("n5r", "n6r")
arrow("n6r", "n7r")
arrow("n7r", "n8r")
arrow("n8r", "n9r")
arrow("n9r", "n10r")

# === CURVED ARROW: n4r -> n1 ===
s4r = shapes["n4r"]
sn1 = shapes["n1"]
sx = s4r["cx"] + s4r["w"] / 2  # right edge of n4r
sy = (s4r["vt"] + s4r["vb"]) / 2  # mid-height of n4r
ex, ey = sn1["cx"], sn1["vt"]  # top-center of n1
pts = array.array("d", [sx, sy, sx + 1.2, sy - 0.5, sx + 1.2, ey + 0.8, ex, ey])
curve = page.DrawSpline(pts, 0, 0)
try: curve.CellsU("EndArrow").FormulaForce = "11"
except: pass
try: curve.CellsU("LineWeight").FormulaForce = "2 pt"
except: pass

# === SAVE & OPEN ===
out = os.path.expanduser(r"~\Documents\饵料间工作流程图.vsdx")
doc.SaveAs(out)
os.startfile(out)
print("已保存至: " + out)
